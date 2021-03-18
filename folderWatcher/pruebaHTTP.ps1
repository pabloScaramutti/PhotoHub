
### ruta a vigilar + extensiones a vigilar (todas, porque solo se puede poner 1 la comprobacion la hago despues) + Vigilo los subdirectorios
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "C:\Users\PC\Pictures\Prueba Subida Fotos\"
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true  

$filter = '*.jpg', '*.png', '*.mp4', '*.raw', '*.mov'

$Uri = 'http://192.168.0.123:1337/fotos'

#Lo que hace cuando tira el evento de watch
$action = {
  $path = $Event.SourceEventArgs.FullPath
  $name = $Event.SourceEventArgs.Name
  $changeType = $Event.SourceEventArgs.ChangeType

  Write-Host $changeType

  #Compruebo que cumpla con alguna extension o filtro
  ForEach ($_ in $filter) {
    
    If ($path -like $_) {
      Write-Host "$($event.SourceEventArgs.FullPath) matched $_" 
            
      #Preparo para mandarlo a Strapi
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
    else {
      Write-Host "$_ Not match"
    }
  }
}    

#Watcher
Register-ObjectEvent $watcher "Created" -Action $action
# Register-ObjectEvent $watcher "Changed" -Action $action
Register-ObjectEvent $watcher "Renamed" -Action $action

while ($true) { Start-Sleep 3 }