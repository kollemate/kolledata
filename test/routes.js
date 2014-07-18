var request = require('supertest');
var assert = require('assert');
var kd = require('../app.js');

describe('GET some pages', function(){
    describe('waiting for server setup', function() {
        it('should return 200 OK', function(done) {
            request(kd)
                .get('/')
                .expect(200, done);
        });
    });

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


describe('test a new single user', function(){
    var test_id;

    var testperson = {
        firstName: 'Max',
        lastName: 'Mustermann',
        url: 'http://test.com',
        email: 'test@test.com',
        memo: 'test memo',
        company: '- N/A -'
    };

    var testperson_name = {
        firstName: 'Max',
        lastName: 'Mustermann'
    };

    describe('POST new person to /persons/new', function(){
        it('should return 200 OK', function(done){
            request(kd)
                .post('/persons/new')
                .send(testperson)
                .expect(302, done);
                // testing the redirect to /persons doesn't feel right,
                // is this really the kind of redirect we want to be using for this?
                // 302 is actually 'moved temporarily'...
        });
    });

    describe('POST to /persons/find to get ID of new person', function(){
        it('should return 200 OK', function(done){
            request(kd)
                .post('/persons/find')
                .send(testperson_name)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    } else {
                        test_id = JSON.parse(res.text)[0].per_id;
                        console.log('ID is: ', test_id);
                    }
                });
        });
    });

    describe('GET /persons/' + test_id, function() {
        var urlpath = '/persons/' + test_id;
        it('should return 200 OK', function(done){
            request(kd)
                .get(urlpath)
                .expect(200, done);
        });
    });

    describe('GET /persons/' + test_id + '/edit', function() {
        var urlpath = '/persons/' + test_id + '/edit';
        it('should return 200 OK', function(done){
            request(kd)
                .get(urlpath)
                .expect(200, done);
        });
    });

    //TODO: edit something on testperson
    // don't forget to check if the edits actually came through

    describe('POST /persons/delete', function(){
        it('should return 200 OK', function(done){

            var send_id = {
                per_id: test_id
            };

            request(kd)
                .post('/persons/delete')
                .send(send_id)
                .expect(302, done);
        });
    });

});
