import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AIModule } from '@/ai/AIModule'

describe('AIModule', () => {

    beforeEach(() => {
        global.fetch = vi.fn()
    })

    it('näyttää adapterilistan', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => [
                { name: 'dummyAI', active: true },
                { name: 'ollamaAI', active: false },
            ],
        } as Response)

        render(<AIModule />)

        await waitFor(() => {
            expect(screen.getByText('dummyAI')).toBeInTheDocument()
            expect(screen.getByText('ollamaAI')).toBeInTheDocument()
        })
    })

    it('lähettää aktivointipyynnön kun nappia klikataan', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce({
                json: async () => [
                    { name: 'dummyAI', active: true },
                    { name: 'ollamaAI', active: false },
                ],
            } as Response)
            .mockResolvedValueOnce({} as Response)
            .mockResolvedValueOnce({               // uudelleenhaku aktivoinnin jälkeen
                json: async () => [
                    { name: 'dummyAI', active: false },
                    { name: 'ollamaAI', active: true },
                ],
            } as Response)

        render(<AIModule />)

        await waitFor(() => screen.getByText('ollamaAI'))

        await userEvent.click(screen.getByRole('button', { name: /aktivoi ollamaAI/i }))

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/ai/adapters/ollamaAI/activate',
            expect.objectContaining({ method: 'POST' })
        )
    })

    it('shouldShowErrorMessageWhenFetchFails', async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

        render(<AIModule />)

        await waitFor(() => {
            expect(screen.getByText('Yhteys palvelimeen epäonnistui')).toBeInTheDocument()
        })
    })
})