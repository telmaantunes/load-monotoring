import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PaginationSection from './PaginationSection.vue'

describe('PaginationSection', () => {
  const itemCount = 100
  const itemsPerPage = 10

  it('renders the correct number of page buttons', () => {
    const wrapper = mount(PaginationSection, {
      props: {
        itemCount,
        itemsPerPage,
        modelValue: 1,
      },
    })

    const pageButtons = wrapper.findAll('.pagination-section__button')
    const expectedPageCount = Math.ceil(itemCount / itemsPerPage)

    // +2 accounts for "Previous" and "Next" buttons
    expect(pageButtons.length).toBe(expectedPageCount + 2)
  })

  it('disables the "Previous" button when on the first page', () => {
    const wrapper = mount(PaginationSection, {
      props: {
        itemCount,
        itemsPerPage,
        modelValue: 1,
      },
    })

    const prevButton = wrapper.find('.pagination-section__button--disabled')
    expect(prevButton.text()).toBe('Previous')
  })

  it('disables the "Next" button when on the last page', () => {
    const wrapper = mount(PaginationSection, {
      props: {
        itemCount,
        itemsPerPage,
        modelValue: 10,
      },
    })

    const nextButton = wrapper.find('.pagination-section__button--disabled')
    expect(nextButton.text()).toBe('Next')
  })

  it('changes page when a number button is clicked', async () => {
    const wrapper = mount(PaginationSection, {
      props: {
        itemCount,
        itemsPerPage,
        modelValue: 1,
      },
    })

    let activeButton = wrapper.find('.pagination-section__button--active')
    expect(activeButton.text()).toBe('1')

    const pageButton = wrapper.findAll('.pagination-section__button')[2]
    await pageButton.trigger('click')

    activeButton = wrapper.find('.pagination-section__button--active')
    expect(activeButton.text()).toBe('2')
  })

  it('updates currentPage when "Next" or "Previous" is clicked', async () => {
    const wrapper = mount(PaginationSection, {
      props: {
        itemCount,
        itemsPerPage,
        modelValue: 1,
      },
    })

    let activeButton = wrapper.find('.pagination-section__button--active')
    expect(activeButton.text()).toBe('1')

    const nextButton = wrapper.findAll('.pagination-section__button').at(-1) // Next button
    await nextButton?.trigger('click')

    activeButton = wrapper.find('.pagination-section__button--active')
    expect(activeButton.text()).toBe('2')

    const prevButton = wrapper.findAll('.pagination-section__button').at(0) // Previous button
    await prevButton?.trigger('click')

    activeButton = wrapper.find('.pagination-section__button--active')
    expect(activeButton.text()).toBe('1')
  })
})
