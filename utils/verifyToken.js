import jwt from 'jsonwebtoken'
export async function verifyToken(token) {
	if (token) {
		const decodeToken = jwt.verify(token, process.env.JWT_SECRET)

		const userId = await decodeToken.issuer
		return userId
	}
	return null
}
