if(!global.hasOwnProperty('config')){
    global.config = {
        constant: require('./constant'),
        db: {
            dbname:     'demo-node-portal',
            username:   'postgres',
            password:   '12345'
        },
        sfdc: {
            username: 'atodaria.siddhraj@yahoo.com',
            password: 'siddh@4489',
            token: 'NQsnPbokC7HL33au3UHneTsfL',
            environment: 'PRODUCTION'
        },
        demo_sfdc: {
            username: 'atodaria.siddhraj@yahoo.com',
            password: 'siddh@4489',
            token: 'NQsnPbokC7HL33au3UHneTsfL',
            environment: 'PRODUCTION'
        },
        smtpconfig :{
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use SSL
            auth: {
                user: '',
                pass: ''
            }
        },
        dashboardConfig :{
            title: 'My Task',
            tabLabel: 'Home',
            icon: 'fa fa-dashboard',
            tabICON: 'fa fa-dashboard',
            sldsicon: 'dashboard',
            sldstabICON: 'home',
            active: true,
            showRefreshResult: true
        },
        archivalConfig :{
            title: 'Archival',
            tabLabel: 'Archival',
            icon: 'fa fa-archive',
            tabICON: 'fa fa-archive',
            sldsicon: 'summary',
            sldstabICON: 'summary',
            active: true,
            showRefreshResult: true
        }
    };
}

module.exports = global.config;