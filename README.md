# 说明
基于VictoriaMetrics v1.87 LTS版本扩展，因为v1.90版本是不兼容升级，暂时不准备跟进；

## 计划增加以下功能：
1，支持remote read接口

2，降采样功能

3，优化被限流场景下的动作

4，TODO

---
## 常用构建命令
make victoria-metrics-linux-amd64-prod  //构建bin文件,定义在app/victoria-metrics/Makefile

make package-victoria-metrics-amd64  //直接构建docker镜像,定义在app/victoria-metrics/Makefile  docker库/镜像名/版本等定义在 deployment/docker/Makefile

make push-victoria-metrics-amd64 //推送镜像


---
原始的README可以看[官网链接](https://github.com/VictoriaMetrics/VictoriaMetrics/tree/v1.87.6)
或者[本地文件](./README-VM.md)
