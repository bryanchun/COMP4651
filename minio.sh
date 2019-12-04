                                            # create minio deployments
kubectl create -f "https://github.com/minio/minio/blob/master/docs/orchestration/kubernetes/minio-standalone-pvc.yaml?raw=true"
kubectl create -f "https://github.com/minio/minio/blob/master/docs/orchestration/kubernetes/minio-standalone-deployment.yaml?raw=true"
                                            # access key and secret key inside
kubectl create -f "https://github.com/minio/minio/blob/master/docs/orchestration/kubernetes/minio-standalone-service.yaml?raw=true"

kubectl expose deployment/minio --type="NodePort" --port 9000
                                            # expose minio's port

echo 'waiting for minio URL to get ready'
until $(kubectl get all | grep pod/minio | grep -q Running); do
    # may take a while to minio URL not found
    echo -n '.'
    sleep 10
done
echo 'done'

export MINIO_PORT=$(kubectl get services/minio -o go-template='{{(index .spec.ports 0).nodePort}}')
export MINIO_URL=http://$(minikube ip):$MINIO_PORT
                                            # check exposed and get port number of minio on Kubernetes
                                            # remember minio's hosted URL
