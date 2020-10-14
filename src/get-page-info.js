function getPageInfo(url, $) {
  const title = $('title').text() || " "
  const description = $("meta[name=description]").attr('content') || $('p').text().slice(0, 180)
  const page = { url, title, description, rating: 1 }
  return page;
}

module.exports = getPageInfo