var request = require('supertest');
var assert = require('assert');
var kd = require('../app.js');

describe('GET /', function() {
    it('should return 200 OK', function(done) {
        request(kd)
            .get('/')
            .expect(200, done);
    });
});

describe('GET /persons', function() {
    it('should return 200 OK', function(done) {
        request(kd)
            .get('/persons')
            .expect(200, done);
    });
});

describe('GET /persons/1', function() {
    it('should return 200 OK', function(done){
        request(kd)
            .get('/persons/1')
            .expect(200, done);
    });
});

describe('GET /companies', function() {
    it('should return 200 OK', function(done) {
        request(kd)
            .get('/companies')
            .expect(200, done);
    });
});

describe('GET /about', function() {
    it('should return 200 OK', function(done) {
        request(kd)
           .get('/about')
           .expect(200, done);
    });
});

describe('GET /import', function() {
    it('should return 200 OK', function(done) {
        request(kd)
           .get('/import')
           .expect(200, done);
    });
});

describe('GET /api/persons', function() {
    it('should return 200 OK', function(done) {
        request(kd)
          .get('/api')
          .expect(200, done);
    });
});

describe('GET /doesntexist', function(){
    it('should return 404 NOT FOUND', function(done){
        request(kd)
            .get('/doesntexist')
            .expect(404, done);
    });
});
