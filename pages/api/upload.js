import multiparty from 'multiparty';

export default async function handler(req, res) {
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        console.log(files.length)
        return res.json("ok")
    })

}

export const config = {
    api: {bodyParser: false}
}