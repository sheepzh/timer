[1mdiff --git a/script/icon_log_read.py b/script/icon_log_read.py[m
[1mindex f17d058..9c1d320 100644[m
[1m--- a/script/icon_log_read.py[m
[1m+++ b/script/icon_log_read.py[m
[36m@@ -43,6 +43,7 @@[m [msecond_domain_pattern = re.compile(r'[a-zA-Z0-9-_]{1,61}\.[a-zA-Z0-9-_]{1,61}')[m
 [m
 [m
 def resolve_icon(url, urls):[m
[32m+[m[32m    print('Start: ' + url)[m
     existIconUrl = 'https://favicon-1256916044.cos.ap-guangzhou.myqcloud.com/' + url[m
     response = requests.get(existIconUrl)[m
     req_code = response.status_code % 100[m
[36m@@ -55,22 +56,23 @@[m [mdef resolve_icon(url, urls):[m
             all_fullurls.append('http://' + www_url + '/')[m
             all_fullurls.append('https://' + www_url + '/')[m
         for fullurl in all_fullurls:[m
[31m-            if find_and_save_icon(fullurl):[m
[32m+[m[32m            if find_and_save_icon(fullurl, url):[m
                 return[m
         urls.append(url)[m
 [m
 [m
[31m-def find_and_save_icon(url):[m
[32m+[m[32mdef find_and_save_icon(url, domain):[m
[32m+[m[32m    print('Trying: ' + url)[m
     icons = favicon.get(url)[m
[31m-    icons = filter(lambda icon: icon.width is not 0, icons)[m
     if not len(icons):[m
         return False[m
     icons = sorted(icons, key=lambda icon: icon.width)[m
     for icon in icons:[m
[31m-        response = requests.get(icon.url)[m
[31m-        if(response.status_code == 200):[m
[31m-            with open('./icons/'+url, 'wb') as f:[m
[32m+[m[32m        response = requests.get(icon.url, timeout=1)[m
[32m+[m[32m        if response.status_code == 200:[m
[32m+[m[32m            with open('./icons/' + domain, 'wb') as f:[m
                 f.write(response.content)[m
[32m+[m[32m            print('Downloaded: ' + domain)[m
             return True[m
     return False[m
 [m
