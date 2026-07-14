param(
    [int]$Port = 8125,
    [string]$Root = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving '$Root' at $prefix (Ctrl+C to stop)"

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $relPath = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
        if ([string]::IsNullOrEmpty($relPath)) { $relPath = 'index.html' }
        $fullPath = Join-Path $Root $relPath

        if ((Test-Path $fullPath) -and -not (Get-Item $fullPath).PSIsContainer) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $ct = $mime[$ext]
            if (-not $ct) { $ct = 'application/octet-stream' }
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $res.ContentType = $ct
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $relPath")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
        $res.OutputStream.Close()
    } catch {
        Write-Host "Error: $_"
    }
}
