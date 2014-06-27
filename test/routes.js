var request = require('supertest');
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

//fill me in POST request to /persons/new
var test_id;

// params:
var firstName = 'Max';
var lastName = 'Mustermann';
var url = 'http://test.com';
var email = 'test@test.com';
var memo = 'test memo';
var company = '- N/A -';

describe ('POST /persons/new', function(){
    it('should return 200 OK', function(done){
        request(kd)
            // how?
    });
});

//params:
var per_id = test_id;

describe ('POST /persons/delete', function(){
    it('should return 200 OK', function(done){
        request(kd)
            // how?
    });
});
