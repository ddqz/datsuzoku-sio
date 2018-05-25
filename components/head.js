import React from 'react'
import Head from 'next/head'
import styles from '../static/styles/index.scss'
import NProgress from 'nprogress'
import Router from 'next/router'

Router.onRouteChangeStart = (url) => {
    NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

export default ({ title, page }) => (
    <div className={`head`}>
        <Head>
            <title>{title}</title>
            <meta charSet='utf-8'/>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link href="https://fonts.googleapis.com/css?family=Assistant:300,400,600,700" rel="stylesheet"/>
            <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet"/>
            <link href="https://cdn.bootcss.com/antd/3.0.0/antd.min.css" rel="stylesheet"/>
        </Head>
        <style jsx global>{styles}</style>
    </div>
)
