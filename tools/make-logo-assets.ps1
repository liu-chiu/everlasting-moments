Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$logoPath = Join-Path $root "public\images\logo-con-dau.png"

function Remove-WhiteBackground([string]$path) {
  $source = [System.Drawing.Bitmap]::FromFile($path)
  $width = $source.Width
  $height = $source.Height
  # The center of this circular seal is negative space; its alpha makes the
  # script safe to rerun against the already-processed logo.
  if ($source.GetPixel([int]($width / 2), [int]($height / 2)).A -eq 0) {
    $source.Dispose()
    return
  }

  $foreground = [System.Array]::CreateInstance([bool], $width * $height)
  $output = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $radius = 4

  # Use a higher contrast floor for teal and warm petals, and a lower one for
  # the lighter purple petal. Lighter anti-aliased pixels are reconstructed
  # from their nearest solid pixel to avoid a white fringe.
  for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
      $pixel = $source.GetPixel($x, $y)
      $dr = 255 - $pixel.R
      $dg = 255 - $pixel.G
      $db = 255 - $pixel.B
      $distance = [Math]::Sqrt($dr * $dr + $dg * $dg + $db * $db)
      $coreDistanceFloor = 190
      $isPurple = $db -lt ($dg * 0.85) -and $dr -ge ($dg * 0.75) -and $dr -le ($dg * 1.3)
      if ($isPurple) { $coreDistanceFloor = 142 }
      if ($pixel.A -gt 0 -and $distance -ge $coreDistanceFloor) {
        $foreground[$y * $width + $x] = $true
      }
    }
  }

  for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
      $pixel = $source.GetPixel($x, $y)
      if ($pixel.A -eq 0) {
        $output.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        continue
      }
      if ($foreground[$y * $width + $x]) {
        $output.SetPixel($x, $y, $pixel)
        continue
      }

      $nearestX = -1
      $nearestY = -1
      $nearestDistanceSquared = ($radius + 1) * ($radius + 1)
      for ($dy = -$radius; $dy -le $radius; $dy++) {
        $candidateY = $y + $dy
        if ($candidateY -lt 0 -or $candidateY -ge $height) { continue }
        for ($dx = -$radius; $dx -le $radius; $dx++) {
          $distanceSquared = $dx * $dx + $dy * $dy
          if ($distanceSquared -ge $nearestDistanceSquared) { continue }
          $candidateX = $x + $dx
          if ($candidateX -lt 0 -or $candidateX -ge $width) { continue }
          if ($foreground[$candidateY * $width + $candidateX]) {
            $nearestX = $candidateX
            $nearestY = $candidateY
            $nearestDistanceSquared = $distanceSquared
          }
        }
      }

      if ($nearestX -lt 0) {
        $output.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        continue
      }

      $solid = $source.GetPixel($nearestX, $nearestY)
      $solidR = 255 - $solid.R
      $solidG = 255 - $solid.G
      $solidB = 255 - $solid.B
      $observedR = 255 - $pixel.R
      $observedG = 255 - $pixel.G
      $observedB = 255 - $pixel.B
      $solidMagnitudeSquared = $solidR * $solidR + $solidG * $solidG + $solidB * $solidB
      $alpha = ($observedR * $solidR + $observedG * $solidG + $observedB * $solidB) / [double]$solidMagnitudeSquared
      $alpha = [Math]::Max(0, [Math]::Min(1, $alpha))

      $residualR = $observedR - $alpha * $solidR
      $residualG = $observedG - $alpha * $solidG
      $residualB = $observedB - $alpha * $solidB
      $residualSquared = $residualR * $residualR + $residualG * $residualG + $residualB * $residualB
      if ($alpha -lt 0.04 -or $residualSquared -gt 2500) {
        $output.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        continue
      }

      $foregroundR = [Math]::Max(0, [Math]::Min(255, [Math]::Round(($pixel.R - 255 * (1 - $alpha)) / $alpha)))
      $foregroundG = [Math]::Max(0, [Math]::Min(255, [Math]::Round(($pixel.G - 255 * (1 - $alpha)) / $alpha)))
      $foregroundB = [Math]::Max(0, [Math]::Min(255, [Math]::Round(($pixel.B - 255 * (1 - $alpha)) / $alpha)))
      $outputAlpha = [int][Math]::Round($alpha * $pixel.A)
      $color = [System.Drawing.Color]::FromArgb($outputAlpha, [int]$foregroundR, [int]$foregroundG, [int]$foregroundB)
      $output.SetPixel($x, $y, $color)
    }
  }

  $temporaryPath = "$path.tmp.png"
  $output.Save($temporaryPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $source.Dispose()
  $output.Dispose()
  Move-Item -LiteralPath $temporaryPath -Destination $path -Force
  Write-Output "removed white background: $path"
}

function Save-Scaled([string]$sourcePath, [string]$destinationPath, [int]$size) {
  $image = [System.Drawing.Image]::FromFile($sourcePath)
  $bitmap = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $destination = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
  $sourceRectangle = New-Object System.Drawing.Rectangle(0, 0, $image.Width, $image.Height)
  $graphics.DrawImage($image, $destination, $sourceRectangle, [System.Drawing.GraphicsUnit]::Pixel)
  $bitmap.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
  $image.Dispose()
  Write-Output "saved $destinationPath"
}

# The site logo and both browser icons use the same transparent artwork.
Remove-WhiteBackground $logoPath
Save-Scaled $logoPath (Join-Path $root "public\favicon.png") 48
Save-Scaled $logoPath (Join-Path $root "public\apple-touch-icon.png") 180
