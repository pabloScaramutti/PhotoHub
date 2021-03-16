$Uri = 'http://192.168.0.123:1337/fotos'

$path = 'C:\Users\PC\Pictures\Prueba Subida Fotos\39.png'
$name = '39.png'

$data = @{
  nombre     = $name
  puntuacion = 0
} | ConvertTo-Json


$data = @{
  data              = $data
  "files.thumbnail" = Get-Item -Path $path
}

Write-Host ($Form | Out-String)
Write-host $name


$Response = Invoke-WebRequest -Uri $Uri -Method Post -Form $data 
# $Result = Invoke-WebRequest -Uri $Uri -Method Post -Form $Form


