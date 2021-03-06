
import { isFunction                               } from '../../../base/index.mjs';
import { after, before, describe, finish, EXAMPLE } from '../../../covert/index.mjs';
import { IP                                       } from '../../../stealth/source/parser/IP.mjs';
import { Host                                     } from '../../../stealth/source/server/Host.mjs';
import { connect, disconnect                      } from '../Server.mjs';



before(connect);

describe('new Host()', function(assert) {

	assert(this.server !== null);
	assert(this.server.services.host instanceof Host, true);

});

describe('Host.isHost()', function(assert) {

	assert(isFunction(Host.isHost), true);

	assert(Host.isHost(null), false);
	assert(Host.isHost({}),   false);

	assert(Host.isHost({
		domain: 'example.com',
		hosts: [
			EXAMPLE.ipv4,
			EXAMPLE.ipv6
		]
	}), true);

});

describe('Host.prototype.save()', function(assert) {

	assert(this.server !== null);
	assert(isFunction(this.server.services.host.save), true);

	this.server.services.host.save({
		domain: 'example.com',
		hosts: [
			IP.parse('127.0.0.1'),
			IP.parse('::1')
		]
	}, (response) => {

		assert(response, {
			headers: {
				service: 'host',
				event:   'save'
			},
			payload: true
		});

	});

});

describe('Host.prototype.read()/success', function(assert) {

	assert(this.server !== null);
	assert(isFunction(this.server.services.host.read), true);

	this.server.services.host.read({
		domain: 'example.com'
	}, (response) => {

		assert(response, {
			headers: {
				service: 'host',
				event:   'read'
			},
			payload: {
				domain: 'example.com',
				hosts: [
					IP.parse('127.0.0.1'),
					IP.parse('::1')
				]
			}
		});

	});

});

describe('Host.prototype.refresh()', function(assert) {

	assert(this.server !== null);
	assert(isFunction(this.server.services.host.refresh), true);

	this.server.services.host.refresh({
		domain: 'example.com'
	}, (response) => {

		assert(response, {
			headers: {
				service: 'host',
				event:   'refresh'
			},
			payload: {
				domain: 'example.com',
				hosts: [
					EXAMPLE.ipv4,
					EXAMPLE.ipv6
				]
			}
		});

	});

});

describe('Host.prototype.read()/success', function(assert) {

	assert(this.server !== null);
	assert(isFunction(this.server.services.host.read), true);

	this.server.services.host.read({
		domain: 'example.com'
	}, (response) => {

		assert(response, {
			headers: {
				service: 'host',
				event:   'read'
			},
			payload: {
				domain: 'example.com',
				hosts: [
					EXAMPLE.ipv4,
					EXAMPLE.ipv6
				]
			}
		});

	});

});

describe('Host.prototype.remove()/success', function(assert) {

	assert(this.server !== null);
	assert(isFunction(this.server.services.host.remove), true);

	this.server.services.host.remove({
		domain: 'example.com'
	}, (response) => {

		assert(response, {
			headers: {
				service: 'host',
				event:   'remove'
			},
			payload: true
		});

	});

});

describe('Host.prototype.read()/success', function(assert) {

	assert(this.server !== null);
	assert(isFunction(this.server.services.host.read), true);

	this.server.services.host.read({
		domain: 'example.com'
	}, (response) => {

		assert(response, {
			headers: {
				service: 'host',
				event:   'read'
			},
			payload: {
				domain: 'example.com',
				hosts: [
					EXAMPLE.ipv4,
					EXAMPLE.ipv6
				]
			}
		});

	});

});

describe('Host.prototype.remove()/success', function(assert) {

	assert(this.server !== null);
	assert(isFunction(this.server.services.host.remove), true);

	this.server.services.host.remove({
		domain: 'example.com'
	}, (response) => {

		assert(response, {
			headers: {
				service: 'host',
				event:   'remove'
			},
			payload: true
		});

	});

});

after(disconnect);


export default finish('stealth/server/Host', {
	internet: true
});

