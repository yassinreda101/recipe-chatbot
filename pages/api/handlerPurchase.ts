import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { email, purchasedBooks } = req.body

      // Generate download links (this would typically involve creating signed URLs for your file storage service)
      const downloadLinks = purchasedBooks.map((book: { id: string, title: string }) => ({
        title: book.title,
        link: `https://your-site.com/download/${book.id}?token=${generateToken()}`,
      }))

      // Send email
      const msg = {
        to: email,
        from: 'captain@proteinpirate.com',
        subject: 'Your ProteinPirate E-Cookbook Purchase',
        text: `Thank ye for yer purchase! Here be yer download links:\n\n${downloadLinks.map(book => `${book.title}: ${book.link}`).join('\n')}`,
        html: `<h1>Thank ye for yer purchase!</h1><p>Here be yer download links:</p><ul>${downloadLinks.map(book => `<li><a href="${book.link}">${book.title}</a></li>`).join('')}</ul>`,
      }

      await sgMail.send(msg)

      res.status(200).json({ message: 'Purchase successful, email sent!' })
    } catch (error) {
      console.error('Error processing purchase:', error)
      res.status(500).json({ error: 'Failed to process purchase' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

function generateToken() {
  // Generate a unique token for the download link
  return Math.random().toString(36).substr(2, 9)
}