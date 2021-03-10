'''
    Read the log of website icon request and find the icon which doesn't exist.
    
    How to use:

        python3 icon_log_read.py {log_dir} 
    
    @author zhy
    @date 20210310
'''
import sys
import os


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
                # /taptap.com?1231=12321
                url = cols[29].split(' ')[1][1:]
                if url.find('?') != -1:
                    url = url[0:url.find('?')]
                if url and url not in urls:
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
            parseLog(file_path, urls404)
    print(urls404)


main()
