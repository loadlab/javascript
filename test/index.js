import LoadLab from '../src/index';
import { assert } from 'chai';

const client = new LoadLab(process.env.LOADLAB_API_TOKEN)

describe('The api should be able to get data from the api', () => {
  it('should get jobs', done => {
    client.jobs.get().then(response => {
      assert.isNotEmpty(response)
      assert.isNotEmpty(response.results)
      assert.hasAllKeys(response, [ 'count', 'next', 'previous', 'results' ])
    }).finally(done)
  });

  it('should get plans', done => {
    client.plans.get().then(response => {
      assert.isNotEmpty(response)
      assert.isNotEmpty(response.results)
      assert.hasAllKeys(response, [ 'count', 'next', 'previous', 'results' ])
    }).finally(done)
  });

  it('should get sites', done => {
    client.sites.get().then(response => {
      assert.isNotEmpty(response)
      assert.isNotEmpty(response.results)
      assert.hasAllKeys(response, [ 'count', 'next', 'previous', 'results' ])
    }).finally(done)
  });

  it('should get a failure', done => {
    const errorClient = new LoadLab('bad-token')
    errorClient.sites.get().then(response => {
      // Do nothing
    }).catch(error => {
      assert.equal(error.response.detail, 'Invalid token.')
    }).finally(done)
  })
});
