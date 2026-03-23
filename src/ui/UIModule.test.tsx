import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { UIModule } from '@/ui/UIModule'
import { UI_ADAPTER_NAMES } from '@/test/constants'


describe('UIModule', () => {

    beforeEach(() => {
        global.fetch = vi.fn()
        vi.stubGlobal('open', vi.fn())
    })

    it('shouldShowAdapterList', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => [
                { name: 'webUI', active: false },
                { name: 'desktopUI', active: false },
            ],
        } as Response)

        render(<UIModule />)

        await waitFor(() => {
            expect(screen.getByText('webUI')).toBeInTheDocument()
            expect(screen.getByText('desktopUI')).toBeInTheDocument()
        })
    })

    it('shouldSendActivateRequestWhenOpenButtonClicked', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce({
                json: async () => [
                    { name: 'webUI', active: false },
                    { name: 'desktopUI', active: false },
                ],
            } as Response)
            .mockResolvedValueOnce({} as Response)
            .mockResolvedValueOnce({
                json: async () => [
                    { name: 'webUI', active: true },
                    { name: 'desktopUI', active: false },
                ],
            } as Response)

        render(<UIModule />)

        await waitFor(() => screen.getByText('webUI'))
        await userEvent.click(screen.getByRole('button', { name: /avaa webUI/i }))

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/ui/adapters/webUI/activate',
            expect.objectContaining({ method: 'POST' })
        )
    })

    it('shouldSendCloseRequestWhenCloseButtonClicked', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce({
                json: async () => [
                    { name: 'webUI', active: true },
                    { name: 'desktopUI', active: false },
                ],
            } as Response)
            .mockResolvedValueOnce({} as Response)
            .mockResolvedValueOnce({
                json: async () => [
                    { name: 'webUI', active: false },
                    { name: 'desktopUI', active: false },
                ],
            } as Response)

        render(<UIModule />)

        await waitFor(() => screen.getByText('webUI'))
        await userEvent.click(screen.getByRole('button', { name: /sulje webUI/i }))

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/ui/adapters/webUI/close',
            expect.objectContaining({ method: 'POST' })
        )
    })

    it('shouldShowErrorMessageWhenFetchFails', async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

        render(<UIModule />)

        await waitFor(() => {
            expect(screen.getByText('Yhteys palvelimeen epäonnistui')).toBeInTheDocument()
        })
    })

    it('shouldOpenNewTabWhenThymeleafUIActivated', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce({
                json: async () => [
                    { name: 'thymeleafUI', active: false },
                    { name: 'desktopUI', active: false },
                ],
            } as Response)
            .mockResolvedValueOnce({} as Response)
            .mockResolvedValueOnce({
                json: async () => [
                    { name: 'thymeleafUI', active: true },
                    { name: 'desktopUI', active: false },
                ],
            } as Response)

        render(<UIModule />)

        await waitFor(() => screen.getByText('thymeleafUI'))
        await userEvent.click(screen.getByRole('button', { name: /avaa thymeleafUI/i }))

        expect(global.open).toHaveBeenCalledWith('http://localhost:8080', '_blank')
    })

    it('shouldPollAdaptersEveryFiveSeconds', async () => {
        vi.mocked(fetch).mockResolvedValue({
            json: async () => [
                { name: UI_ADAPTER_NAMES.THYMELEAF, active: false },
                { name: UI_ADAPTER_NAMES.DESKTOP, active: false },
            ],
        } as Response)

        render(<UIModule pollInterval={100} />)

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2), { timeout: 1000 })
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3), { timeout: 1000 })
    })
})