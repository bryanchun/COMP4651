# COMP4651

### Setup

1. Follow instructions in https://github.com/bryanchun/faas
2. Run `. ./host.sh` to start local development
3. Install npm packages by `cd m2h; npm install; cd ..`
4. To deploy a function: specify the Kubenetes ip as `$MINIKUBE_IP`, docker username as `$DOCKER_USERNAME`, and pass in the function configuration yml. For example:

    `MINIKUBE_IP=$(minikube ip) DOCKER_USERNAME=bryanchun faas-cli up -f m2h.yml`