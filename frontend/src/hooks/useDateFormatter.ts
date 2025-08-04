import dayjs from 'dayjs'

export const useDateFormatter = () => {
  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm')
  }

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY')
  }

  const formatTime = (dateString: string) => {
    return dayjs(dateString).format('HH:mm')
  }

  return {
    formatDateTime,
    formatDate,
    formatTime
  }
}