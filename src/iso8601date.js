const iso8601date = () => (new Date()).toISOString()
    .replace('T', ' ')
    .replace('Z', '');

export default iso8601date;
