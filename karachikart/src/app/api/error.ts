export default function errorHandler(err: any) {
  console.error(err);
  return new Response(JSON.stringify({
    message: err.message || 'An error occurred',
    status: err.status || 500
  }), {
    status: err.status || 500,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 