module.exports = {
	'port': process.env.PORT || 3000,
	"database": "mongodb://admin:123123@ds031531.mongolab.com:31531/library_booking",
	//Manual DB access (only use if you know what you're doing!) with
	//mongo --host ds031531.mongolab.com --port 31531 -u admin -p 123123 library_booking
	'secret': 'TJMi6nG5YJh6gzQz15Ycq9kqUFP3pgDvZpFvHi/noATJtqtYTLGSQKZFA4Lw/6Xdqfj718UF5SNGBoR2oXDARA==' //Generated with: openssl rand -base64 64
};
