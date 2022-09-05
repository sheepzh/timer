import { devide2Buckets } from "@src/background/backup/gist/compressor"

test('devide 1', () => {
    const rows: timer.stat.Row[] = [{
        host: 'www.baidu.com',
        date: '20220801',
        focus: 0,
        time: 10,
        total: 1000,
        mergedHosts: []
    }]
    const devided = devide2Buckets(rows)
    expect(devided.length).toEqual(1)
    const [bucket, gistData] = devided[0]
    expect(bucket).toEqual('202208')
    expect(gistData).toEqual({
        "01": {
            "www.baidu.com": [10, 0, 1000]
        }
    })
})
