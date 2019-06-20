**外呼平台前置前端**

>demo 分支 请不要动，这是演示版本

`yarn start`
：启动

`umi build`
：项目打包

**运行**

>环境配置：python:^2.7 and docker-compose:latest

将docker-compose.yml移动到与dist同目录下，运行

`docker-compose up -d`


## 用docker运行项目

docker build -t hit/front-umi:1.0.123 .
docker run -d --name front-umit --restart=always -p 8017:8087 hit/front-umi:1.0.123

