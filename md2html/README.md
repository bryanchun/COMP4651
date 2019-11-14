CLI version (on macOS):

``` bash
curl -d "$(cat mymarkdown.md)" http://$OPENFAAS_URL/function/md2html > output.html; open output.html
# or if hosted the function locally:
cat mymarkdown.md | faas-cli invoke md2html > output.html; open output.html
```