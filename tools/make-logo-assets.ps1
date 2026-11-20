Add-Type -AssemblyName System.Drawing

$root = "c:\Users\chung.nv\OneDrive - Sacom Crypto Asset Exchange Joint Stock Company\chungnv\thiep cuoi\everlasting-moments"
$src = Join-Path $root "logo_con_dau_src.jpg"

function Save-Square([string]$srcPath, [string]$dstPath, [int]$size, [bool]$round) {
  $img = [System.Drawing.Image]::FromFile($srcPath)
  # crop center square
  $side = [Math]::Min($img.Width, $img.Height)
  $sx = [int](($img.Width - $side) / 2)
  $sy = [int](($img.Height - $side) / 2)
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.InterpolationMode = 'HighQualityBicubic'
  if ($round) {
    $g.Clear([System.Drawing.Color]::Transparent)
    $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
    $clip.AddEllipse(0, 0, $size, $size)
    $g.SetClip($clip)
  }
  $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
  $srcRect = New-Object System.Drawing.Rectangle($sx, $sy, $side, $side)
  $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  Write-Output "saved $dstPath"
}

# Logo used across the site (round, transparent corners)
Save-Square $src (Join-Path $root "public\images\logo-con-dau.png") 512 $true
# Favicon (square)
Save-Square $src (Join-Path $root "public\favicon.png") 48 $false
# Apple touch icon (square)
Save-Square $src (Join-Path $root "public\apple-touch-icon.png") 180 $false
