'''
    Read the log of website icon request and find the icon which doesn't exist.

    How to use:

        python3 icon_log_read.py {log_dir}

    @author zhy
    @date 20210310
'''
import sys
# pip3 install validators
import validators
import os
import re
import requests
import favicon


def split(line):
    result = []
    quoted = False
    temp = ''
    for c in line:
        if c == '"':
            if quoted:
                quoted = False
                result.append(temp.strip())
                temp = ''
            else:
                quoted = True
        elif c == ' ' and not quoted and temp:
            result.append(temp.strip())
            temp = ''
        else:
            temp = temp + c
    if temp:
        result.append(temp)
    return result


second_domain_pattern = re.compile(r'[a-zA-Z0-9-_]{1,61}\.[a-zA-Z0-9-_]{1,61}')


def resolve_icon(url, urls):
    print('Start: ' + url)
    existIconUrl = 'https://favicon-1256916044.cos.ap-guangzhou.myqcloud.com/' + url
    response = requests.get(existIconUrl)
    req_code = response.status_code % 100
    if req_code is 2:
        return
    if req_code == 4:
        all_fullurls = ['http://' + url + '/', 'https://' + url + '/']
        if second_domain_pattern.match(url):
            www_url = 'www.'+url
            all_fullurls.append('http://' + www_url + '/')
            all_fullurls.append('https://' + www_url + '/')
        for fullurl in all_fullurls:
            if find_and_save_icon(fullurl, url):
                return
        urls.append(url)


def find_and_save_icon(url, domain):
    print('Trying: ' + url)
    icons = favicon.get(url)
    if not len(icons):
        return False
    icons = sorted(icons, key=lambda icon: icon.width)
    for icon in icons:
        response = requests.get(icon.url, timeout=1)
        if response.status_code == 200:
            with open('./icons/' + domain, 'wb') as f:
                f.write(response.content)
            print('Downloaded: ' + domain)
            return True
    return False


INVALID_URLS = ['jzjs.5gzvip.idcfengye.com']


def parse_log(fileName, urls):
    with open(fileName, 'r') as logFile:
        for line in logFile.readlines():
            # print(line)
            cols = split(line)
            res_code = cols[14].strip()

            if res_code == '404':
                # e.g. /taptap.com
                http = cols[29].split(' ')
                if http[0] != 'GET':
                    continue
                url = http[1][1:]
                if '?' in url or url.endswith('/') or url == 'favicon.ico' or url.endswith('.png') or url == 'favicon-1256916044.cos.ap-guangzhou.myqcloud.com':
                    # Request by Tencent Cloud
                    continue
                # print(cols[29])
                if url and url not in urls:
                    if not validators.domain(url) or url.endswith('gitee.io') or url.endswith('github.io') or url in INVALID_URLS:
                        print("INVALID DOMAIN: " + url)
                        continue
                    try:
                        resolve_icon(url, urls)
                    except:
                        urls.append(url)

    return urls


def main():
    argvs = sys.argv
    if len(argvs) < 2:
        print('No log file')
        return
    work_dir = argvs[1]
    urls404 = []
    for parent, _, filenames in os.walk(work_dir,  followlinks=True):
        for filename in filenames:
            file_path = os.path.join(parent, filename)
            if os.path.exists(file_path):
                parse_log(file_path, urls404)
    print(urls404)


main()
