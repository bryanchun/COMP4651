# COMP4651

### Setup

1. Follow instructions in https://github.com/bryanchun/faas
2. Run `. ./host.sh` to start local development
3. Install npm packages by `cd m2h; npm install; cd ..`
4. Deploy Minio storage by running `. ./minio.sh`
5. Deploy the main function: specify the Kubenetes IP as `$MINIKUBE_IP`, Docker username as `$DOCKER_USERNAME`, Minio port number from `$MINIO_PORT`, and pass in the function configuration yml. For example:

    `MINIKUBE_IP=$(minikube ip) DOCKER_USERNAME=bryanchun MINIO_POST=$MINIO_PORT faas-cli up -f m2h.yml`