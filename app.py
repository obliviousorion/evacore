from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os

class DashboardHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/save':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            try:
                # Security check: only allow saving to finalevals.md in the current directory
                file_path = os.path.join(os.getcwd(), 'finalevals.md')
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(data['content'])
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success'}).encode())
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    import webbrowser
    print("Dashboard Server started at http://localhost:8080")
    print("Press Ctrl+C to stop.")
    webbrowser.open('http://localhost:8080')
    server = HTTPServer(('localhost', 8080), DashboardHandler)
    server.serve_forever()
