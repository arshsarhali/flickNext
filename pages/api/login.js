import { magicAdmin } from '../../lib/magic'
import jwt from 'jsonwebtoken'
import { isNewUser, createNewUser } from '../../lib/db/hasura'
import { setTokenCookie } from '../../lib/cookies'

export default async function login(req, res) {
	if (req.method === 'POST') {
		try {
			const auth = req.headers.authorization
			const didToken = auth ? auth.substr(7) : ''

			const metadata = await magicAdmin.users.getMetadataByToken(didToken)

			const token = jwt.sign(
				{
					...metadata,
					iat: Math.floor(Date.now() / 1000),
					exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
					'https://hasura.io/jwt/claims': {
						'x-hasura-allowed-roles': ['user', 'admin'],
						'x-hasura-default-role': 'user',
						'x-hasura-user-id': `${metadata.issuer}`,
					},
				},
				process.env.JWT_SECRET
			)

			const isNewUserQuer = await isNewUser(token, metadata.issuer)

			isNewUserQuer && (await createNewUser(token, metadata))
			const setCookie = setTokenCookie(token, res)
			console.log(setCookie)

			res.send({ done: true })
		} catch (err) {
			console.log('Something went wrong', err)
			res.status(500).send('something went wrong')
		}
	} else {
		res.send('wrong method')
	}
}
