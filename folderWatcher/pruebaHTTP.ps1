
### SET FOLDER TO WATCH + FILES TO WATCH + SUBFOLDERS YES/NO
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "C:\Users\PC\Pictures\Prueba Subida Fotos\"
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true  

$Uri = 'http://192.168.0.123:1337/fotos'

#Lo que hace cuando tira el evento de watch
$action = { 
  $path = $Event.SourceEventArgs.FullPath
  $name = $Event.SourceEventArgs.Name

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
}    

#Watcher
Register-ObjectEvent $watcher "Created" -Action $action

while ($true) { Start-Sleep 5 }