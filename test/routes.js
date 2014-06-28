var request = require('supertest');
var assert = require('assert');
var kd = require('../app.js');

describe('GET some pages', function(){
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
                .get('/api/persons')
                .expect('Content-Type', /json/)
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
});


describe('set up a dummy user', function(){
    //fill me in POST request to /persons/new... somehow
    var test_id;

    describe('POST new person to /persons/new', function(){
        it('should return 200 OK', function(done){
            var testperson = {
                firstName: 'Max',
                lastName: 'Mustermann',
                url: 'http://test.com',
                email: 'test@test.com',
                memo: 'test memo',
                company: '- N/A -'
            };

            request(kd)
                .post('/persons/new')
                .send(testperson)
                .expect(302, done);
                // testing the redirect to /persons doesn't feel right,
                // is this really the kind of redirect we want to be using for this?
                // 302 is actually 'moved temporarily'...

            var testperson_name = {
                firstName: 'Max',
                lastName: 'Mustermann'
            };

            test_id = request(kd)
                .post('/persons/find')
                .send(testperson_name);
        });
    });

    describe('GET /persons/' + test_id, function() {
        it('should return 200 OK', function(done){
            request(kd)
                .get('/persons/' + test_id)
                .expect(200, done);
        });
    });

    describe('GET /persons/' + test_id + '/edit', function() {
        it('should return 200 OK', function(done){
            request(kd)
                .get('/persons/' + test_id + '/edit')
                .expect(200, done);
        });
    });

    //TODO: edit something on testperson

    describe('POST /persons/delete', function(){
        it('should return 200 OK', function(done){

            var send_id = {
                per_id: test_id
            };

            request(kd)
                .post('/persons/delete')
                .send(send_id)
                .expect(200, done);
        });
    });

});
