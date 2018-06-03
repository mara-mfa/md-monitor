# md-portlet-boilerplate-docker
Boilerplate project for mDesktop portlet - docker container version

## How to use
(Github support svn export on git repositories)

`svn export https://github.com/pgmtc/md-portlet-boilerplate-docker/trunk new-portlet`

`cd new-portlet`

`npm install`

## Build portlet package
`npm run build`

## Serve portlet and the data
`npm start`

### Using different port
`export PORT=9091 && npm start`

Portlet will be accesible on http://localhost:9092/

## Files
Front end source files are in /src/portlet/

Back end source files are in /src/server/
