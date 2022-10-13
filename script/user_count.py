import pygal
from collections import OrderedDict
import sys
import json
import os
import cairosvg
import requests
import math

svg_file_path = os.path.join('output', 'user_count.svg')
output_dir_path = 'output'

def smooth_count(last_value, step_num, current_value, data):
    unit_val = (current_value-last_value) / (step_num+1)
    for i in range(step_num):
        data.append(unit_val*(i+1)+last_value)
    data.append(current_value)


def quit_with(msg: str):
    print(msg)
    quit()


def zoom(data, reduction):
    i = 0
    new_data = []
    while i < len(data):
        new_data.append(data[i])
        i += reduction
    return new_data


def render():
    edge_user = read_json('user_edge')
    chrome_user = read_json('user_chrome')
    firefox_user = read_json('user_firefox')
    dates = set()
    for date in edge_user:
        dates.add(date)
    for date in chrome_user:
        dates.add(date)
    for date in firefox_user:
        dates.add(date)
    sorted_date = sorted(dates)
    last_edge, last_chrome, last_firefox = 0, 0, 0
    edge_step, chrome_step, firefox_step = 0, 0, 0

    edge_data = []
    chrome_data = []
    firefox_data = []
    for date in sorted_date:
        if date in chrome_user:
            val = chrome_user[date]
            smooth_count(last_chrome, chrome_step, val, chrome_data)
            last_chrome = val
            chrome_step = 0
        else:
            chrome_step += 1
        if date in edge_user:
            val = edge_user[date]
            smooth_count(last_edge, edge_step, val, edge_data)
            last_edge = val
            edge_step = 0
        else:
            edge_step += 1
        if date in firefox_user:
            val = firefox_user[date]
            smooth_count(last_firefox, firefox_step, val, firefox_data)
            last_firefox = val
            firefox_step = 0
        else:
            firefox_step += 1
    smooth_count(last_chrome, chrome_step, last_chrome, chrome_data)
    smooth_count(last_edge, edge_step, last_edge, edge_data)
    smooth_count(last_firefox, firefox_step, last_firefox, firefox_data)

    data_size = len(chrome_data)
    reduction = math.floor(data_size/100)
    chrome_data = zoom(chrome_data, reduction)
    edge_data = zoom(edge_data, reduction)
    firefox_data = zoom(firefox_data, reduction)
    sorted_date = zoom(sorted_date, reduction)

    chart = pygal.StackedLine(
        fill=True, style=pygal.style.styles['default'](label_font_size=8))
    chart.title = 'Active User Count / {} to {}'.format(
        sorted_date[0], sorted_date[-1])

    chart.add('Firefox', firefox_data)
    chart.add('Chrome', chrome_data)
    chart.add('Edge', edge_data)
    svg = chart.render()
    if not os.path.exists(output_dir_path):
        os.makedirs(output_dir_path)
    with open(svg_file_path, 'wb') as svg_file:
        svg_file.write(svg)
    cairosvg.svg2svg(file_obj=open(svg_file_path, 'r'), write_to=svg_file_path)


def read_json(name):
    dir_path = 'data'
    if not os.path.exists(dir_path):
        os.mkdir(dir_path)
        return None
    file_path = os.path.join(dir_path, '{}.json'.format(name))
    if not os.path.exists(file_path):
        return None
    with open(file_path, 'r', encoding='utf8') as json_file:
        content = '\n'.join(json_file.readlines())
        return json.loads(content)


def write_json(name, json_obj):
    dir_path = 'data'
    if not os.path.exists(dir_path):
        os.mkdir(dir_path)
    file_path = os.path.join(dir_path, '{}.json'.format(name))
    with open(file_path, 'w', encoding='utf8') as json_file:
        json_file.write(json.dumps(json_obj, indent=4))


def add_chrome(file_path):
    json_file = 'user_chrome'
    if not os.path.exists(file_path):
        quit_with("File not found: {}".format(file_path))
    # 1. parse input data
    input_data = {}
    with open(file_path, encoding='utf8', mode='r') as csv_file:
        lines = csv_file.readlines()[2:]
        for line in lines:
            if not line:
                continue
            splits = line.split(',')
            origin_date = splits[0]
            value = int(splits[1])
            date = '-'.join(map(lambda a: a.rjust(2, '0'),
                            origin_date.split('/')))
            input_data[date] = value
    # 2. read exist data
    exist_data = read_json(json_file)
    if not exist_data:
        exist_data = {}
    # 3. migrate
    for key, val in input_data.items():
        if key not in exist_data and val:
            exist_data[key] = val
    # 4. write with sorted by key
    write_json(json_file, OrderedDict(sorted(exist_data.items())))
    pass


def add_edge(file_path):
    json_file = 'user_edge'
    if not os.path.exists(file_path):
        quit_with("File not found: {}".format(file_path))
    # 1. parse input data
    input_data = {}
    with open(file_path, encoding='utf8', mode='r') as csv_file:
        lines = csv_file.readlines()[1:]
        for line in lines:
            if not line:
                continue
            splits = line.split(',')
            date = splits[5]
            value = int(splits[6])
            input_data[date] = value
            if not value and len(input_data):
                # The last line maybe zero caused by edge's bug
                continue
    # 2. read exist data
    exist_data = read_json(json_file)
    if not exist_data:
        exist_data = {}
    # 3. migrate
    for key in input_data:
        if key not in exist_data:
            exist_data[key] = input_data[key]
    # 4. write with sorted by key
    write_json(json_file, OrderedDict(sorted(exist_data.items())))
    pass


def add_firefox(file_path):
    json_file = 'user_firefox'
    if not os.path.exists(file_path):
        quit_with("File not found: {}".format(file_path))
    # 1. parse input data
    input_data = {}
    with open(file_path, encoding='utf8', mode='r') as csv_file:
        lines = csv_file.readlines()[4:]
        for line in lines:
            if not line:
                continue
            splits = line.split(',')
            date = splits[0]
            value = int(splits[1])
            input_data[date] = value
    # 2. read exist data
    exist_data = read_json(json_file)
    if not exist_data:
        exist_data = {}
    # 3. migrate
    for key in input_data:
        if key not in exist_data:
            exist_data[key] = input_data[key]
    # 4. write with sorted by key
    write_json(json_file, OrderedDict(sorted(exist_data.items())))
    pass


def add():
    argv = sys.argv
    if len(argv) < 4 or argv[2] not in ['c', 'e', 'f']:
        quit_with("add [c/e/f] [file_name]")
    browser = argv[2]
    file_path = argv[3]
    if browser == 'c':
        add_chrome(file_path)
    elif browser == 'e':
        add_edge(file_path)
    elif browser == 'f':
        add_firefox(file_path)
    else:
        pass


GIST_TOKEN_ENV = 'TIMER_USER_COUNT_GIST_TOKEN'
DESC = "User count of timer, auto-generated"


def upload2gist():
    argv = sys.argv
    # 1. find token and svg file
    token = argv[2] if len(argv) > 2 else os.environ.get(GIST_TOKEN_ENV)
    if not token:
        quit_with(
            "Token is None, please input with command or set with environment TIMER_USER_COUNT_GIST_TOKEN"
        )
    if not os.path.exists(svg_file_path):
        quit_with('Svg file not found')
    # 2. find exist gist file
    token_header = 'Bearer {}'.format(token)
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": token_header
    }
    response = requests.get('https://api.github.com/gists', headers=headers)
    status_code = response.status_code
    if status_code != 200:
        quit_with("Failed to list exist gists: statusCode={}".format(status_code))
    gist_list = json.loads(response.content)
    exist_gist = next(
        (gist for gist in gist_list if 'description' in gist and gist['description'] == DESC),
        None
    )
    svg_content = ''
    with open(svg_file_path, 'r') as file:
        svg_content = '\r\n'.join(file.readlines())
    if not svg_content:
        quit_with("Failed to read svg file")
    data = json.dumps({
        "description": DESC,
        "public": True,
        "files": {
            "user_count.svg": {
                "content": svg_content
            }
        }
    })
    # 3. create new one or update
    if not exist_gist:
        print("Gist not found, so try to create one")
        response = requests.post('https://api.github.com/gists',
                                 data=data, headers=headers)
        status_code = response.status_code
        if status_code != 200 and status_code != 201:
            quit_with(
                'Failed to create new gist: statusCode={}'.format(status_code)
            )
        else:
            print('Success to create new gist')
    else:
        gist_id = exist_gist['id']
        response = requests.post('https://api.github.com/gists/{}'.format(gist_id),
                                 data=data, headers=headers)
        status_code = response.status_code
        if status_code != 200 and status_code != 201:
            quit_with("Failed to update gist: id={}, statusCode={}".format(
                gist_id,
                status_code
            ))
        else:
            print("Success to update gist")


def main():
    argv = sys.argv
    if len(argv) == 1 or argv[1] not in ['render', 'add', 'upload']:
        print("Supported command: render, add, upload")
        quit()

    cmd = argv[1]
    if cmd == 'render':
        render()
    elif cmd == 'add':
        add()
    elif cmd == 'upload':
        render()
        upload2gist()
    else:
        pass


if __name__ == '__main__':
    main()
