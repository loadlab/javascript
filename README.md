# LoadLab JS
Javascript Client for the LoadLab REST API.

## Setup

    $ npm i loadlab

## Usage

```js
const client = new LoadLab('<LOADLAB_API_TOKEN>')

// Get jobs
client.jobs.get().then(response => {
// do stuff with the response here
})

// Get plans
client.plans.get().then(response => {
// do stuff with the response here
})

// Get sites
client.sites.get().then(response => {
// do stuff with the response here
})

```
