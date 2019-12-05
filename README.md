# COMP4651

## Setup

1. Follow instructions in <https://github.com/bryanchun/faas>
2. Run `. ./host.sh` to start local development
3. Install npm packages by `cd md2html; npm install; cd ..`
4. Deploy Minio storage by running `. ./minio.sh`
5. Deploy the main function: specify the Kubenetes IP as `$MINIKUBE_IP`, **your** Docker username used in Docker Hub and Docker Desktop as `$DOCKER_USERNAME`, optionally the Minio port number from `$MINIO_PORT`, and pass in the function configuration yml. For example:

    `MINIKUBE_IP=$(minikube ip) DOCKER_USERNAME=bryanchun MINIO_POST=$MINIO_PORT faas-cli up -f md2html.yml`

    - If the function does not update over some time, remove the function first by `faas-cli remove md2html` then run the above `up` command

6. Check out logs with `kubectl logs deployment/md2html -n openfaas-fn`