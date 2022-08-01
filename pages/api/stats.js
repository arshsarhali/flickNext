import jwt from 'jsonwebtoken'
import {
	findVideoIdByUser,
	updateStats,
	insertStats,
} from '../../lib/db/hasura'
import { verifyToken } from '../../utils/verifyToken'

export default async function stats(req, res) {
	try {
		if (!req.cookies.token) {
			res.status(403).json({ error: 'Wrong Request' })
		} else {
			const token = req.cookies.token
			const userId = await verifyToken(token)
			const inputParams = req.method === 'POST' ? req.body : req.query
			const { videoId } = inputParams

			const findVideo = await findVideoIdByUser(token, userId, videoId)
			const doesStatexist = findVideo?.length > 0
			if (req.method === 'POST') {
				const { watched = true, favourited } = req.body
				if (doesStatexist) {
					await updateStats(token, {
						watched,
						favourited,
						userId,
						videoId,
					})
				} else {
					await insertStats(token, {
						watched,
						favourited,
						userId,
						videoId,
					})
				}

				res.status(200).json({ message: 'Stats changed' })
			} else {
				if (doesStatexist) {
					res.status(200).json(findVideo)
				} else {
					res.status(404).json({ error: 'Video not found' })
				}
			}
		}
	} catch (err) {
		console.log(err)
		req.status(500).json({ error: 'Stats failed to change' })
	}
}
