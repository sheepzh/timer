'''
    Read the log of website icon request and find the icon which doesn't exist.

    How to use:

        python3 icon_log_read.py {log_dir}

    @author zhy
    @date 20210310
'''
import sys
import os
import requests


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


def parseLog(fileName, urls):
    with open(fileName, 'r') as logFile:
        for line in logFile.readlines():
            # print(line)
            cols = split(line)
            res_code = cols[14].strip()

            if res_code == '404':
                # /taptap.com
                http = cols[29].split(' ')
                if http[0] != 'GET':
                    continue
                url = http[1][1:]
                if '?' in url or url.endswith('/') or url == 'favicon.ico' or url.endswith('.png') or url == 'favicon-1256916044.cos.ap-guangzhou.myqcloud.com':
                    # Request by Tencent Cloud
                    continue
                # print(cols[29])
                if url and url not in urls:
                    try:
                        req = requests.get(
                            'https://favicon-1256916044.cos.ap-guangzhou.myqcloud.com/' + url
                        )
                        if req.status_code == 404:
                            req = requests.get(
                                'http://'+url+'/favicon.ico', timeout=1
                            )
                            if(req.status_code == 200):
                                with open('./icons/'+url, 'wb') as f:
                                    f.write(req.content)
                            else:
                                urls.append(url)
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
                parseLog(file_path, urls404)
    print(urls404)


main()
