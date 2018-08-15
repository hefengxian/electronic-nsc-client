

export default {
    shortcuts: [
        {
            text: '今天',
            value () {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime())
                return [start, end]
            }
        },
        {
            text: '昨天',
            value () {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24)
                end.setTime(start.getTime())
                return [start, end];
            }
        },
        {
            text: '最近 7 天',
            value () {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
                return [start, end]
            }
        },
        {
            text: '最近 30 天',
            value () {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                return [start, end]
            }
        },
    ]
}