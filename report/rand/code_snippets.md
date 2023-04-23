MONGO:
```
[~]$ mongo --host mongodb://10.43.252.173
MongoDB shell version v4.4.4
connecting to: mongodb://10.43.252.173:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("79ee559d-4fca-46bb-9ddb-f0b74b577833") }
MongoDB server version: 6.0.3
WARNING: shell and server versions do not match
> 
```

CURL:
```
[~]$ curl localhost:80 | tail -n 5    
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  7204  100  7204    0     0  17.7M      0 --:--:-- --:--:-- --:--:-- 7035k
<body class="mat-typography">
  <app-root></app-root>
<script src="runtime.aaedba49815d2ab0.js" type="module"></script><script src="polyfills.1a4a779d95e3f377.js" type="module"></script><script src="main.6ba2ddb10fe8c064.js" type="module"></script>

</body></html>%                                                                                                                                               
[~]$ kubectl get pods -n neurorecovery
NAME                                            READY   STATUS    RESTARTS   AGE
mongodb-68c5cf6564-lwqjm                        1/1     Running   0          11m
neurorecovery-frontend-chart-7d79877c94-zk7km   1/1     Running   0          11m
neurorecovery-backend-chart-5fb666c56f-9bs2q    1/1     Running   0          8m24s
[~]$ kubectl delete pod -n neurorecovery neurorecovery-frontend-chart-7d79877c94-zk7km 
pod "neurorecovery-frontend-chart-7d79877c94-zk7km" deleted
[~]$ 
[~]$ curl localhost:80 | tail -n 5                                                    
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  7204  100  7204    0     0  15.4M      0 --:--:-- --:--:-- --:--:-- 7035k
<body class="mat-typography">
  <app-root></app-root>
<script src="runtime.aaedba49815d2ab0.js" type="module"></script><script src="polyfills.1a4a779d95e3f377.js" type="module"></script><script src="main.6ba2ddb10fe8c064.js" type="module"></script>

</body></html>%                                                                                                                                               
[~]$ kubectl get pods -n neurorecovery                                                
NAME                                            READY   STATUS    RESTARTS   AGE
mongodb-68c5cf6564-lwqjm                        1/1     Running   0          12m
neurorecovery-backend-chart-5fb666c56f-9bs2q    1/1     Running   0          8m41s
neurorecovery-frontend-chart-7d79877c94-vgbph   1/1     Running   0          8s
[~]$
```

LOGS:
```
[~]$ k logs -n neurorecovery neurorecovery-frontend-chart-7d79877c94-zk7km 
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
2022/11/17 13:57:57 [notice] 1#1: using the "epoll" event method
2022/11/17 13:57:57 [notice] 1#1: nginx/1.23.2
2022/11/17 13:57:57 [notice] 1#1: built by gcc 10.2.1 20210110 (Debian 10.2.1-6) 
2022/11/17 13:57:57 [notice] 1#1: OS: Linux 6.0.8-300.fc37.x86_64
2022/11/17 13:57:57 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2022/11/17 13:57:57 [notice] 1#1: start worker processes
2022/11/17 13:57:57 [notice] 1#1: start worker process 29
2022/11/17 13:57:57 [notice] 1#1: start worker process 30
2022/11/17 13:57:57 [notice] 1#1: start worker process 31
2022/11/17 13:57:57 [notice] 1#1: start worker process 32
2022/11/17 13:57:57 [notice] 1#1: start worker process 33
2022/11/17 13:57:57 [notice] 1#1: start worker process 34
2022/11/17 13:57:57 [notice] 1#1: start worker process 35
2022/11/17 13:57:57 [notice] 1#1: start worker process 36
2022/11/17 13:57:57 [notice] 1#1: start worker process 37
2022/11/17 13:57:57 [notice] 1#1: start worker process 38
2022/11/17 13:57:57 [notice] 1#1: start worker process 39
2022/11/17 13:57:57 [notice] 1#1: start worker process 40
[~]$ k logs -n neurorecovery neurorecovery-backend-chart-5fb666c56f-9bs2q 
[2022-11-17T14:01:05Z INFO  backend] neurorecovery backend serving at: 0.0.0.0:8080
[~]$ 
```

HELM:
```
[~]$ helm ls -n neurorecovery 
NAME                            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                                   APP VERSION
mongodb                         neurorecovery   2               2022-11-17 11:21:05.991524504 +0000 UTC deployed        mongodb-13.4.4                          6.0.3      
neurorecovery-backend-chart     neurorecovery   1               2022-11-17 12:20:18.600654951 +0000 UTC deployed        neurorecovery-backend-chart-0.1.0       1.16.0     
neurorecovery-frontend-chart    neurorecovery   1               2022-11-17 11:39:41.275011588 +0000 UTC deployed        neurorecovery-frontend-chart-0.1.0      1.16.0     
[~]$
```

KUBECTL LS:
```
[~]$ kubectl get all -n neurorecovery 
NAME                                                READY   STATUS    RESTARTS   AGE
pod/mongodb-68c5cf6564-vcx7f                        1/1     Running   0          98m
pod/neurorecovery-frontend-chart-859979cb95-ggbbg   1/1     Running   0          73m
pod/neurorecovery-backend-chart-6754d5547d-rvsnr    1/1     Running   0          33m

NAME                                            TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
service/mongodb                                 ClusterIP      10.43.252.173   <none>          27017/TCP        98m
service/neurorecovery-frontend-chart-balancer   LoadBalancer   10.43.54.119    <pending>       80:32691/TCP     73m
service/neurorecovery-backend-chart-balancer    LoadBalancer   10.43.83.251    192.168.1.167   8080:32381/TCP   33m

NAME                                           READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/mongodb                        1/1     1            1           98m
deployment.apps/neurorecovery-frontend-chart   1/1     1            1           73m
deployment.apps/neurorecovery-backend-chart    1/1     1            1           33m

NAME                                                      DESIRED   CURRENT   READY   AGE
replicaset.apps/mongodb-68c5cf6564                        1         1         1       98m
replicaset.apps/neurorecovery-frontend-chart-859979cb95   1         1         1       73m
replicaset.apps/neurorecovery-backend-chart-6754d5547d    1         1         1       33m
[~]$
```
