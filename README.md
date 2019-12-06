# COMP4651

Real-time Serverless File Processing: A Markdown to HTML parser

## Setup

1. Follow instructions in <https://github.com/bryanchun/faas>
2. Run `. ./host.sh` to start local development
3. Install npm packages by `cd md2html; npm install; cd ..`
4. Deploy Minio storage by running `. ./minio.sh`
5. Deploy the main function: specify the Kubenetes IP as `$MINIKUBE_IP`, **your** Docker username used in Docker Hub and Docker Desktop as `$DOCKER_USERNAME`, optionally the Minio port number from `$MINIO_PORT`, and pass in the function configuration yml. For example:

    `MINIKUBE_IP=$(minikube ip) DOCKER_USERNAME=bryanchun MINIO_POST=$MINIO_PORT faas-cli up -f md2html.yml`

    - If the function does not update over some time, remove the function first by `faas-cli remove md2html` then run the above `up` command

6. Check out logs with `kubectl logs deployment/md2html -n openfaas-fn`

## Usage

1. In your browser, open `http://YOUR_MINIKUBE_IP:31112/function/md2html`, for example `http://192.168.99.143:31112/function/md2html/`
2. You can use the function in 3 ways:

    - Directly put your markdown source as text in the text box, then press `Upload`
    - Choose a markdown file to upload from your local storage, then press `Upload`
    - If your markdown file is hosted on the internet as a link already, change the URL of your browser to this and enter:

        `http://$MINIKUBE_IP:31112/function/md2html/with?mdUrl=YOUR_MARKDOWN_URL`

        for example: `http://192.168.99.143:31112/function/md2html/with?mdUrl=https://raw.githubusercontent.com/hakimel/reveal.js/master/README.md`
