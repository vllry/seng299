module.exports = {
	'port': process.env.PORT || 3000, /*Can someone figure out how to change the port without crashing the app?*/
	"database": "mongodb://admin:123123@ds031531.mongolab.com:31531/library_booking",
	//Manual DB access (only use if you know what you're doing!) with
	//mongo --host ds047722.mongolab.com --port 47722 -u admin -p 123123 library_booking
	'secret': 'TJMi6nG5YJh6gzQz15Ycq9kqUFP3pgDvZpFvHi/noATJtqtYTLGSQKZFA4Lw/6Xdqfj718UF5SNGBoR2oXDARA==' //Generated with: openssl rand -base64 64
};
