"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const QueryBuilder_1 = require("../QueryBuilder");
describe('QueryBuilder', () => {
    describe('UrlBuilder', () => {
        /**
         *
         */
        it('toString() should return the raw template when no params or queries are added', () => {
            const builder = new QueryBuilder_1.UrlBuilder('/things');
            (0, chai_1.expect)(builder.toString()).to.equal('/things');
        });
        /**
         *
         */
        it('addParam() should interpolate {name} placeholders with URL-encoded values', () => {
            const builder = new QueryBuilder_1.UrlBuilder('/things/{id}/sub/{key}')
                .addParam('id', 'abc 123')
                .addParam('key', 'a/b');
            (0, chai_1.expect)(builder.toString()).to.equal('/things/abc%20123/sub/a%2Fb');
        });
        /**
         *
         */
        it('addParam() should accept numbers and booleans and coerce them to strings', () => {
            const builder = new QueryBuilder_1.UrlBuilder('/n/{n}/b/{b}')
                .addParam('n', 42)
                .addParam('b', true);
            (0, chai_1.expect)(builder.toString()).to.equal('/n/42/b/true');
        });
        /**
         *
         */
        it('addParam() should let later calls override earlier values for the same key', () => {
            const builder = new QueryBuilder_1.UrlBuilder('/things/{id}')
                .addParam('id', 'first')
                .addParam('id', 'second');
            (0, chai_1.expect)(builder.toString()).to.equal('/things/second');
        });
        /**
         *
         */
        it('toString() should throw when the template references a missing placeholder', () => {
            const builder = new QueryBuilder_1.UrlBuilder('/things/{id}');
            (0, chai_1.expect)(() => builder.toString()).to.throw(/missing value for placeholder '\{id\}'/);
        });
        /**
         *
         */
        it('addQuery() should URL-encode keys and values', () => {
            const builder = new QueryBuilder_1.UrlBuilder('/things')
                .addQuery('q', 'hello world')
                .addQuery('a&b', 'x=y');
            (0, chai_1.expect)(builder.toString()).to.equal('/things?q=hello%20world&a%26b=x%3Dy');
        });
        /**
         *
         */
        it('addQuery() should preserve insertion order across multiple calls', () => {
            const builder = new QueryBuilder_1.UrlBuilder('/things')
                .addQuery('z', '1')
                .addQuery('a', '2')
                .addQuery('m', '3');
            (0, chai_1.expect)(builder.toString()).to.equal('/things?z=1&a=2&m=3');
        });
        /**
         *
         */
        it('addQuery() should emit repeated key=value pairs for duplicate keys', () => {
            const builder = new QueryBuilder_1.UrlBuilder('/things')
                .addQuery('tag', 'one')
                .addQuery('tag', 'two');
            (0, chai_1.expect)(builder.toString()).to.equal('/things?tag=one&tag=two');
        });
        /**
         *
         */
        it('addQuery() should accept numbers and booleans and coerce them to strings', () => {
            const builder = new QueryBuilder_1.UrlBuilder('/things')
                .addQuery('n', 42)
                .addQuery('b', false);
            (0, chai_1.expect)(builder.toString()).to.equal('/things?n=42&b=false');
        });
        /**
         *
         */
        it('addParam() and addQuery() should be chainable in any order', () => {
            const builder = new QueryBuilder_1.UrlBuilder('/things/{id}')
                .addQuery('a', '1')
                .addParam('id', 'abc')
                .addQuery('b', '2');
            (0, chai_1.expect)(builder.toString()).to.equal('/things/abc?a=1&b=2');
        });
    });
    describe('QueryBuilder', () => {
        /**
         *
         */
        it('create() should produce a UrlBuilder rooted at baseUrl + endpointPath + path', () => {
            const qb = new QueryBuilder_1.QueryBuilder('https://example.test/api/v1', '/campaigns');
            const url = qb.create('/{id}/passes').addParam('id', 'abc').toString();
            (0, chai_1.expect)(url).to.equal('https://example.test/api/v1/campaigns/abc/passes');
        });
        /**
         *
         */
        it('create() should default to an empty path that targets the endpoint root', () => {
            const qb = new QueryBuilder_1.QueryBuilder('', '/campaigns');
            (0, chai_1.expect)(qb.create().toString()).to.equal('/campaigns');
        });
        /**
         *
         */
        it('create() should produce relative URLs when constructed with an empty baseUrl', () => {
            const qb = new QueryBuilder_1.QueryBuilder('', '/campaigns');
            const url = qb.create('/{id}/passes')
                .addParam('id', 'abc')
                .addQuery('sort', 'desc')
                .toString();
            (0, chai_1.expect)(url).to.equal('/campaigns/abc/passes?sort=desc');
        });
        /**
         *
         */
        it('create() should isolate independent builders', () => {
            const qb = new QueryBuilder_1.QueryBuilder('', '/things');
            const a = qb.create('/{id}').addParam('id', 'a');
            const b = qb.create('/{id}').addParam('id', 'b');
            (0, chai_1.expect)(a.toString()).to.equal('/things/a');
            (0, chai_1.expect)(b.toString()).to.equal('/things/b');
        });
    });
});
