// config.js
const convict = require('convict');
const convict_format_with_validator = require('convict-format-with-validator');
convict.addFormats(convict_format_with_validator);
require('dotenv').config();

const config = convict({
	env: {
		doc: 'The IP address to bind.',
		format: 'url',
		default: 'http://localhost:3000',
		env: 'API_URL',
	},
	src: {
		doc: 'The IP address to bind.',
		format: 'url',
		default: 'http://localhost:3000/new',
		env: 'NEW_API_URL',
	},
	port: {
		doc: 'The port to bind.',
		format: 'port',
		default: 3001,
		env: 'PROXY_PORT',
		arg: 'port'
	}
});

module.exports = config;