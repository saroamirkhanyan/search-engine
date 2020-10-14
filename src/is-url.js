const isUrl = (url) => {
  return url.match(/^https?:\/\/.+\..+/)
}

module.exports = isUrl