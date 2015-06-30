#!/usr/bin/python3

import json
from urllib.request import urlopen
import urllib.error
from sys import exit



config = {
	'netlinkid': 'python_tester',
	'password' : 'python3'
}



#	HOW TO USE
#
#	'test group name' : {
#		'individual test name' : {
#			'url' : API url,
#			'params' : Dictionary of parameters
#			'bail' : 'all' or 'suite' - optional parameter, use this to stop testing when future tests require this one to succeed. All stops everything, suite skips to the next group of tests.
#			'accept-on' : optional parameter, will cause a test to pass if success retrns false but message matches ths string,
#			'reject-on' : optional parameter, will cause a test to fail if success returns true but message matches this string.
#		}
#	}

tests = {
	'1 - Public Access': {
		'1 - API test': {
			'url': 'http://localhost:3000/api',
			'params' : [],
			'bail' : 'all'
		}
	},

	'2 - User Account': {
		'1 - Registration': {
			'url': 'http://localhost:3000/api/user/register',
			'params' : {'netlinkid':config['netlinkid'], 'password':config['password']},
			'bail' : 'all',
			'accept-on' : 'A user with that netlinkid already exists' #The test user may already exist, and that's okay
		},
		'2 - Rejection Of Duplicate Registration': {
			'url': 'http://localhost:3000/api/user/register',
			'params' : {'netlinkid':config['netlinkid'], 'password':config['password']},
			'bail' : 'all',
			'accept-on' : 'A user with that netlinkid already exists', #We want to confirm that a duplicate account can't be created.
			'reject-on' : 'User created'
		},
		'3 - Rejection Of Incorrect Username': {
			'url': 'http://localhost:3000/api/user/login',
			'params' : {'netlinkid':config['netlinkid']+'invalid', 'password':config['password']},
			'accept-on' : 'User does not exist',
			'reject-on' : 'Logged in' #We want to confirm that this fails
		},
		'4 - Rejection Of Incorrect Password': {
			'url': 'http://localhost:3000/api/user/login',
			'params' : {'netlinkid':config['netlinkid'], 'password':config['password']+'invalid'},
			'accept-on' : 'Invalid password',
			'reject-on' : 'Logged in' #We want to confirm that this fails
		},
		'5 - Login': {
			'url': 'http://localhost:3000/api/user/login',
			'params' : {'netlinkid':config['netlinkid'], 'password':config['password']},
			'bail' : 'all'
		}
	}
}



def done(total, passed, bailed=False):
	print("Passed %i tests out of the %i tests done" % (passed, total))
	if total != passed:
		print("Please try to resolve the problems, and if you can't, please don't push to master")
	if bailed:
		print("Unable to complete the tests due to the failure of a previous test")
		print("This likely means something is SUBSTANTIALLY broken")
	exit(0)



total = 0
passed = 0
for testsuite in sorted(tests.keys()):
	print(('===== Test suite: %s =====' % testsuite).upper())
	category = len(tests[testsuite])
	categorycount = 0

	for test in sorted(tests[testsuite].keys()):
		categorycount += 1
		total += 1
		problem = False
		print('%i/%i:	%s' % (categorycount, category, test))

		try:
			url = tests[testsuite][test]['url']
			data = urllib.parse.urlencode(tests[testsuite][test]['params'])
			if data:
				req = urllib.request.Request(url, data.encode('ascii'))
			else:
				req = urllib.request.Request(url)
			response = urllib.request.urlopen(req)
		except urllib.error.HTTPError as err:
			print(err.code, err.reason)
			print(err.read())
			problem = True

		if not problem:
			accept = None
			if 'accept-on' in tests[testsuite][test]: accept = tests[testsuite][test]['accept-on']
			reject = None
			if 'reject-on' in tests[testsuite][test]: reject = tests[testsuite][test]['reject-on']
			result = json.loads(str(response.read()).lstrip("b'").rstrip("'"))
			if (('success' in result and result['success']) or result['message'] == accept) and result['message'] != reject:
				print('PASS')
				passed += 1
			else:
				problem = True
				print(result)

		if problem:
			print('FAILED')
			if 'bail' in tests[testsuite][test]:
				if tests[testsuite][test]['bail'] == 'all':
					done(total, passed, True)
				elif tests[testsuite][test]['bail'] == 'suite':
					print('Skipping the rest of this test suite')
					break
	print('\n\n')
done(total, passed)
