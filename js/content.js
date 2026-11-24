import { language } from './language.js';

const sections = {
    'experience-en': `<p class="panel-intro">I’m Shuoqi Bao, an undergraduate interested in database systems, data engineering, and analytics.</p>
        <ol class="timeline">
            <li>
                <span class="timeline-date">Sep 2024 – Jun 2028</span>
                <h3>Xi’an Jiaotong-Liverpool University</h3>
                <p>BSc Data Science and Big Data Technology with Contemporary Entrepreneurialism</p>
                <p class="muted">Selected coursework includes database systems, data mining, big data programming, and machine learning.</p>
            </li>
            <li>
                <span class="timeline-date">Summer 2025</span>
                <h3>Yunnan Baiyao Group</h3>
                <p>Database Operations &amp; Data Analysis Intern</p>
                <p class="muted">Supported database operations and data standardization, used SQL to clean and validate business data, and helped organize database logs and maintenance records.</p>
            </li>
        </ol>
        <a class="btn btn-ghost" href="./assets/Shuoqi-Bao-CV.pdf" download>Download CV</a>`,
    'experience-zh': `<p class="panel-intro">我是包朔齐，西交利物浦大学本科生，关注数据库系统、数据工程和数据分析。</p>
        <ol class="timeline">
            <li>
                <span class="timeline-date">2024 年 9 月至 2028 年 6 月</span>
                <h3>西交利物浦大学</h3>
                <p>数据科学与大数据技术（融合创业）本科</p>
                <p class="muted">学习数据库系统、数据挖掘、大数据编程和机器学习等课程。</p>
            </li>
            <li>
                <span class="timeline-date">2025 年暑期</span>
                <h3>云南白药集团</h3>
                <p>数据库运维与数据分析实习生</p>
                <p class="muted">协助数据库日常运维与数据标准化，用 SQL 清洗和校验业务数据，并整理数据库日志与维护记录。</p>
            </li>
        </ol>
        <a class="btn btn-ghost" href="./assets/Shuoqi-Bao-CV.pdf" download>下载英文简历</a>`,
    'skills-en': `<div class="skill-list">
            <section><h3>Databases</h3><p>SQL, PostgreSQL, pgAdmin, relational data modeling, and database operations.</p></section>
            <section><h3>Data analysis</h3><p>Python, Pandas, NumPy, scikit-learn, Matplotlib, and Seaborn.</p></section>
            <section><h3>Distributed processing</h3><p>Hadoop HDFS and Apache Spark.</p></section>
            <section><h3>Campus activities</h3><p>Python and database study groups with the InfoCo Computer Programming Club, and campus volunteer activities.</p></section>
        </div>`,
    'skills-zh': `<div class="skill-list">
            <section><h3>数据库</h3><p>SQL、PostgreSQL、pgAdmin、关系数据建模与数据库运维。</p></section>
            <section><h3>数据分析</h3><p>Python、Pandas、NumPy、scikit-learn、Matplotlib 和 Seaborn。</p></section>
            <section><h3>分布式处理</h3><p>Hadoop HDFS 与 Apache Spark。</p></section>
            <section><h3>校园活动</h3><p>参与 InfoCo 计算机编程社团的 Python 与数据库学习交流，也参加校园志愿活动。</p></section>
        </div>`,
    'projects-en': `<p class="panel-intro empty-state">Projects will appear here when they’re ready.</p>`,
    'projects-zh': `<p class="panel-intro empty-state">项目待更新。</p>`,
    'news-en': `<p class="panel-intro empty-state">No updates yet.</p>`,
    'news-zh': `<p class="panel-intro empty-state">近况待更新。</p>`,
    'contact-en': `<p class="panel-intro">If you’d like to talk about data engineering, university work, or just say hello, feel free to email me.</p>
        <dl class="contact-rows"><dt>Email</dt><dd><a href="mailto:1973330934@qq.com">1973330934@qq.com</a></dd></dl>
        <div class="contact-actions">
            <a class="btn btn-primary" href="mailto:1973330934@qq.com">Email Me</a>
            <a class="btn btn-ghost" href="./assets/Shuoqi-Bao-CV.pdf" download>Download CV</a>
        </div>`,
    'contact-zh': `<p class="panel-intro">如果你想聊聊数据工程、大学学习，或者打个招呼，欢迎给我发邮件。</p>
        <dl class="contact-rows"><dt>邮箱</dt><dd><a href="mailto:1973330934@qq.com">1973330934@qq.com</a></dd></dl>
        <div class="contact-actions">
            <a class="btn btn-primary" href="mailto:1973330934@qq.com">发邮件</a>
            <a class="btn btn-ghost" href="./assets/Shuoqi-Bao-CV.pdf" download>下载英文简历</a>
        </div>`,
};

export function renderContent(id) {
    const template = document.createElement('template');
    template.innerHTML = sections[id + '-' + language];
    for (const link of template.content.querySelectorAll('[href^="./assets/"]')) {
        link.href = new URL(link.getAttribute('href').replace('./', '../'), import.meta.url);
    }
    return template.content;
}
