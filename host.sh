open -a docker                          # get docker running in background
minikube start                          # starts a new Kubernetes local cluster
k3sup app install openfaas              # install OpenFaaS in Helm
echo 'waiting for openfaas pod to get ready'
until $(kubectl get all -n openfaas | grep pod/gateway | grep -q Running); do
    # may take a while to avoid "error: unable to forward port because pod is not running. Current status=Pending" and get the Pod (cluster) ready
    echo -n '.'
    sleep 10
done
echo 'done'

kubectl port-forward svc/gateway -n openfaas 8080:8080 &
                                        # tunnel between local computer with the Kubernetes cluster
jobs                                    # the tunnelling job should be running in background

echo 'waiting for openfaas URL to get ready'
until $(kubectl -n openfaas get pods | grep faas-idler | grep -q Running); do
    # may take a while to avoid "Cannot connect to OpenFaaS on URL: http://xxx.xxx.xx.xxx:31112. Get http://xxx.xxx.xx.xxx:31112/system/functions: dial tcp xxx.xxx.xx.xxx:31112: connect: connection refused" and get the URL ready
    echo -n '.'
    sleep 10
done
echo 'done'

export OPENFAAS_URL=http://$(minikube ip):31112
                                        # remember the hosted URL for OpenFaaS
PASSWORD=$(kubectl get secret -n openfaas basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo)
                                        # generate password for OpenFaaS and register it
echo -n $PASSWORD | faas-cli login --username admin --password-stdin -g $OPENFAAS_URL
                                        # login to OpenFaaS
faas-cli list                           # success check
