``` bash
                                            # create minio deployments
kubectl create -f https://github.com/minio/minio/blob/master/docs/orchestration/kubernetes/minio-standalone-pvc.yaml?raw=true
kubectl create -f https://github.com/minio/minio/blob/master/docs/orchestration/kubernetes/minio-standalone-deployment.yaml?raw=true
                                            # access key and secret key inside
kubectl create -f https://github.com/minio/minio/blob/master/docs/orchestration/kubernetes/minio-standalone-service.yaml?raw=true

kubectl expose deployment/minio --type="NodePort" --port 9000
                                            # expose minio's port
                                            
export MINIO_URL=$(minikube ip):$(kubectl get services/minio -o go-template='{{(index .spec.ports 0).nodePort}}')
                                            # check exposed and get port number of minio on Kubernetes
                                            # remember minio's hosted URL

```

<!-- ``` bash
# After deploying Kubernetes

k3sup app install tiller
# Wait until
kubectl -n kube-system get po | grep tiller-deploy | grep Running

helm install stable/minio
# or


#historical-ibex-minio.default.svc.cluster.local
export POD_NAME=$(kubectl get pods --namespace default -l "release=historical-ibex" -o jsonpath="{.items[0].metadata.name}")
kubectl port-forward $POD_NAME 9000 --namespace default &

open localhost:9000
helm list
# NAME            REVISION        UPDATED                         STATUS          CHART           APP VERSION                   NAMESPACE
# historical-ibex 1               Fri Nov 15 10:23:13 2019        DEPLOYED        minio-2.5.18    RELEASE.2019-08-07T01-59-21Z  default 
helm delete historical-ibex
``` -->