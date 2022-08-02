from symbol import file_input
import pygal
from collections import OrderedDict
import sys
import json
import os
import cairosvg

argv = sys.argv


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
    edge_data = []
    chrome_data = []
    firefox_data = []
    for date in sorted_date:
        last_chrome = chrome_user[date] if date in chrome_user else last_chrome
        chrome_data.append(last_chrome)
        last_edge = edge_user[date] if date in edge_user else last_edge
        edge_data.append(last_edge)
        last_firefox = firefox_user[date] if date in firefox_user else last_firefox
        firefox_data.append(last_firefox)

    chart = pygal.StackedLine(
        fill=True, style=pygal.style.styles['default'](label_font_size=8))
    chart.title = 'Active User Count / {} to {}'.format(
        sorted_date[0], sorted_date[-1])

    chart.add('Firefox', firefox_data)
    chart.add('Edge', edge_data)
    chart.add('Chrome', chrome_data)
    svg = chart.render()
    file_name = 'output/user_count.svg'
    with open(file_name, 'wb') as svg_file:
        svg_file.write(svg)
    cairosvg.svg2svg(file_obj=open(file_name, 'r'), write_to=file_name)


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
        print("File not found", file_path)
        quit()
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
    for key in input_data:
        if key not in exist_data:
            exist_data[key] = input_data[key]
    # 4. write with sorted by key
    write_json(json_file, OrderedDict(sorted(exist_data.items())))
    pass


def add_edge(file_path):
    json_file = 'user_edge'
    if not os.path.exists(file_path):
        print("File not found", file_path)
        quit()
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
        print("File not found", file_path)
        quit()
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
    if len(argv) < 4 or argv[2] not in ['c', 'e', 'f']:
        print("add [c/e/f] [file_name]")
        quit()
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


def main():
    if len(argv) == 1 or argv[1] not in ['render', 'add']:
        print("Supported command: render, add")
        quit()

    cmd = argv[1]
    if cmd == 'render':
        render()
    elif cmd == 'add':
        add()
    else:
        pass


main()


# print(lineChart)
